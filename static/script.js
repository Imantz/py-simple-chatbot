document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages-container");
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");

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
});