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
                body: JSON.stringify({ prompt: message }),
            });

            const data = await response.json();
            loadingElement.remove();
            addMessage(data.response, "bot");
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

    const startWebSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            addMessage("Speech recognition not supported", "bot");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.start();
        micButton.classList.add("bg-red-500"); // Indicate recording

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            if (transcript) sendMessage(transcript); // Send recognized text
        };

        recognition.onerror = () => {
            addMessage("Speech recognition error", "bot");
        };

        recognition.onend = () => micButton.classList.remove("bg-red-500"); // Reset button color
    };

    const startHuggingFaceSTT = async () => {
        micButton.classList.add("bg-red-500"); // Indicate recording
        await recordAndSendAudio();
        micButton.classList.remove("bg-red-500"); // Reset button color
    };

    micButton.addEventListener("click", () => {
        if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
            startWebSpeechRecognition();
        } else {
            startHuggingFaceSTT();
        }
    });

    async function recordAndSendAudio() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                const formData = new FormData();
                formData.append("audio", audioBlob);

                stream.getTracks().forEach((track) => track.stop());

                const response = await fetch("http://127.0.0.1:5000/transcribe", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();
                if (result.transcription) {
                    sendMessage(result.transcription);
                } else {
                    addMessage("Error: Could not transcribe audio", "bot");
                }
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
        } catch (error) {
            addMessage("Microphone access denied", "bot");
        }
    }
});
