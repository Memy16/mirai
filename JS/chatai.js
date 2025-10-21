const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatBotResponse(text) {
    let formatted = escapeHTML(text);
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    
    chatBox.innerHTML += `<div class="user-msg">${escapeHTML(message)}</div>`;
    userInput.value = '';

    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'bot-msg loading';
    loadingDiv.innerHTML = '<img src="https://s3.amazonaws.com/assets.rkdgroup/common-tools/images/loading-data.gif" alt="Cargando..." />';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('../php/ia_preguntas.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `mensaje=${encodeURIComponent(message)}`
        });

        const data = await response.json();
        const botMsg = data.respuesta || "No hay respuesta.";

        
        loadingDiv.innerHTML = formatBotResponse(botMsg);
        loadingDiv.classList.remove('loading');

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
        loadingDiv.innerHTML = "Error al contactar al bot.";
        loadingDiv.classList.remove('loading');
        console.error(err);
    }
});

userInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendBtn.click();
});
