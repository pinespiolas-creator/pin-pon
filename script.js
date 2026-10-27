/* ========================================
PIN-PON — FUNCIONAMIENTO DEL PEDIDO
======================================== */

// IMPORTANTE:
// Reemplazá este valor por el número de WhatsApp
// de Pin-Pon, con código de país y área,
// sin espacios, signos ni guiones.
// Ejemplo de formato argentino: 54911XXXXXXXX

const WHATSAPP_NUMBER = "5491132185743";

const form = document.getElementById("pedido-form");
const tipo = document.getElementById("tipo");
const cantidad = document.getElementById("cantidad");
const total = document.getElementById("total");

const imagenInput = document.getElementById("imagen");
const imagenCampo = document.getElementById("imagen-campo");
const vistaPrevia = document.getElementById("vista-previa");
const imagenPreview = document.getElementById("imagen-preview");
const nombreImagen = document.getElementById("nombre-imagen");

const disenoCampo = document.getElementById("diseno-campo");
const disenoInput = document.getElementById("diseno");

const PRECIO_PERSONALIZADO = 2500;
const PRECIO_DISPONIBLE = 2000;

let imagenSeleccionada = null;
let imagenObjectURL = null;

function obtenerPrecio() {
return tipo.value === "Personalizado"
? PRECIO_PERSONALIZADO
: PRECIO_DISPONIBLE;
}

function actualizarFormulario() {
const esPersonalizado = tipo.value === "Personalizado";

imagenCampo.hidden = !esPersonalizado;
disenoCampo.hidden = esPersonalizado;

imagenInput.required = esPersonalizado;
disenoInput.required = !esPersonalizado;

if (!esPersonalizado) {
imagenInput.value = "";
imagenSeleccionada = null;
vistaPrevia.hidden = true;

if (imagenObjectURL) {
  URL.revokeObjectURL(imagenObjectURL);
  imagenObjectURL = null;
}

}

actualizarTotal();
}

function actualizarTotal() {
const unidades = Math.max(
1,
Math.min(100, Number.parseInt(cantidad.value, 10) || 1)
);

const precio = obtenerPrecio();
const importe = precio * unidades;

total.textContent = importe.toLocaleString("es-AR", {
style: "currency",
currency: "ARS",
maximumFractionDigits: 0
});
}

tipo.addEventListener("change", actualizarFormulario);
cantidad.addEventListener("input", actualizarTotal);

imagenInput.addEventListener("change", function () {
const archivo = imagenInput.files[0];

imagenSeleccionada = null;

if (imagenObjectURL) {
URL.revokeObjectURL(imagenObjectURL);
imagenObjectURL = null;
}

if (!archivo) {
vistaPrevia.hidden = true;
return;
}

if (!archivo.type.startsWith("image/")) {
alert("Elegí un archivo de imagen válido.");
imagenInput.value = "";
vistaPrevia.hidden = true;
return;
}

const MAX_BYTES = 10 * 1024 * 1024;

if (archivo.size > MAX_BYTES) {
alert("La imagen pesa más de 10 MB. Elegí una imagen más liviana.");
imagenInput.value = "";
vistaPrevia.hidden = true;
return;
}

imagenSeleccionada = archivo;
imagenObjectURL = URL.createObjectURL(archivo);

imagenPreview.src = imagenObjectURL;
nombreImagen.textContent = archivo.name;
vistaPrevia.hidden = false;
});

form.addEventListener("submit", function (evento) {
evento.preventDefault();

const nombre = document.getElementById("nombre").value.trim();
const unidades = Number.parseInt(cantidad.value, 10);
const precio = obtenerPrecio();

if (!nombre) {
alert("Escribí tu nombre para continuar.");
return;
}

if (!Number.isInteger(unidades) || unidades < 1 || unidades > 100) {
alert("La cantidad debe estar entre 1 y 100.");
return;
}

if (
tipo.value === "Personalizado" &&
(!imagenSeleccionada || !imagenInput.files.length)
) {
alert("Seleccioná la imagen que querés convertir en pin.");
return;
}

const importe = precio * unidades;

const mensaje = [
"¡Hola, Pin-Pon! Quiero hacer un pedido.",
"",
"Nombre: " + nombre,
"Tipo de pin: " + tipo.value,
"Precio unitario: " + precio.toLocaleString("es-AR", {
style: "currency",
currency: "ARS",
maximumFractionDigits: 0
}),
"Cantidad: " + unidades,
"Total estimado: " + importe.toLocaleString("es-AR", {
style: "currency",
currency: "ARS",
maximumFractionDigits: 0
})
];

if (tipo.value === "Personalizado") {
mensaje.push(
"",
"Imagen elegida: " + imagenSeleccionada.name,
"Adjuntaré la imagen al chat para confirmar el diseño."
);
} else {
mensaje.push(
"",
"Diseño elegido: " + disenoInput.value.trim()
);
}

mensaje.push("", "¡Espero la confirmación del pedido!");

const numeroLimpio = WHATSAPP_NUMBER.replace(/\D/g, "");

if (
numeroLimpio.length < 10 ||
numeroLimpio === "54911XXXXXXXX"
) {
alert(
"Antes de enviar pedidos, configurá el número de WhatsApp de Pin-Pon en script.js."
);
return;
}

const url =
"https://wa.me/" +
numeroLimpio +
"?text=" +
encodeURIComponent(mensaje.join("\n"));

window.open(url, "_blank", "noopener,noreferrer");

if (tipo.value === "Personalizado") {
alert(
"Se abrirá WhatsApp con los datos del pedido. Acordate de adjuntar la imagen seleccionada antes de enviar el mensaje."
);
}
});

// Estado inicial
actualizarFormulario();