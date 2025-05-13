function guardarPerfil() {
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  document.getElementById("mensaje").innerText = `Perfil guardado: ${nombre} - ${correo}`;
}

document.getElementById("img-upload").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profile-img").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
