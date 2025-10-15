const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatBotResponse(text) {
    // Escapamos HTML primero
    let formatted = escapeHTML(text);

    // Reemplazamos **negrita** por <b>negrita</b>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Reemplazamos saltos de línea por <br>
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div class="user-msg">${escapeHTML(message)}</div>`;
    userInput.value = '';

    try {
        const response = await fetch('../php/ia_preguntas.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `mensaje=${encodeURIComponent(message)}`
        });
        const data = await response.json();
        const botMsg = data.respuesta || "No hay respuesta.";
        chatBox.innerHTML += `<div class="bot-msg">${formatBotResponse(botMsg)}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
        chatBox.innerHTML += `<div class="bot-msg">Error al contactar al bot.</div>`;
        console.error(err);
    }
});

userInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendBtn.click();
});
