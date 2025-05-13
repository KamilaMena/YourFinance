const frases = document.querySelectorAll(".carrusel-item");
let indice = 0;

function mostrarSiguienteFrase() {
  frases[indice].classList.remove("activo");
  indice = (indice + 1) % frases.length;
  frases[indice].classList.add("activo");
}

setInterval(mostrarSiguienteFrase, 3000); // cambia cada 3 segundos