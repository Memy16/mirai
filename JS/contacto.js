const params = new URLSearchParams(window.location.search);
if(params.get("status") === "ok"){
    alert("✅ Tu mensaje se envió correctamente.");
} else if(params.get("status") === "error"){
    alert("❌ Hubo un error al enviar el mensaje, inténtalo de nuevo.");
}