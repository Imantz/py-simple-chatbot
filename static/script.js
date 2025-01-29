document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages-container");
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");
    const micButton = document.getElementById("mic-button");

    const addMessage = (message, role) => {
        const messageElement = document.createElement("div");
        messageElement.className = `p-3 rounded-lg max-w-xs break-words shadow-md ${role === "user" ? "bg-purple-500 text-white self-end" : "bg-gray-200 text-gray-800 self-start"}`;
        messageElement.innerText = message;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const sendMessage = async (message) => {
        addMessage(message, "user");

        const loadingElement = document.createElement("p");
        loadingElement.innerText = "Loading...";
        loadingElement.className = "text-gray-500 text-sm italic mt-2";
        messagesContainer.appendChild(loadingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch("http://127.0.0.1:5000/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: message })
            });

            const data = await response.text();
            loadingElement.remove();
            addMessage(data, "bot");
        } catch (error) {
            loadingElement.remove();
            addMessage("Error: Unable to fetch response", "bot");
        }
    };

    messageForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message !== "") {
            messageInput.value = "";
            await sendMessage(message);
        }
    });

    // Microphone functionality
    if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        micButton.addEventListener("click", () => {
            recognition.start();
            micButton.classList.add("bg-red-500"); // Indicate recording
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript.trim() !== "") {
                sendMessage(transcript); // Send the recognized text automatically
            }
        };

        recognition.onend = () => {
            micButton.classList.remove("bg-red-500"); // Reset button color
        };

    } else {
        micButton.disabled = true;
        micButton.title = "Speech recognition not supported in this browser";
    }
});
