const formulario = document.getElementById("formularioMovimiento");
const tipoInput = document.getElementById("tipo");
const tipoMovimientoInput = document.getElementById("tipoMovimiento"); // nuevo
const montoInput = document.getElementById("monto");
const categoriaInput = document.getElementById("categoria");
const tablaBody = document.querySelector("#tablaMovimientos tbody");

const ingresosTotal = document.getElementById("ingresos");
const gastosTotal = document.getElementById("gastos");
const ahorrosTotal = document.getElementById("ahorros");
const saldoDisponibleTotal = document.getElementById("presupuesto");

let ingresos = 0;
let gastos = 0;
let ahorros = 0;

// Categorías según tipo

const categorias = {
  ingreso: ["Salario", "Préstamo", "Regalo"],
  gasto: [
    "Transporte",
    "Comida",
    "Salidas",
    "Compras",
    "Mercado",
    "Salud",
    "Viajes",
    "Servicios",
  ],
};

// Movimiento según tipo

const tiposMovimiento = {
  ingreso: ["Transferencia", "Efectivo", "Consignación"],
  gasto: ["Transferencia", "Efectivo", "Tarjeta", "Débito automático"],
};

// Categorias y tipos de movimiento

tipoInput.addEventListener("change", () => {
  const tipo = tipoInput.value;

  // Categorías
  categoriaInput.innerHTML =
    '<option value="">Selecciona una categoría</option>';
  if (categorias[tipo]) {
    categorias[tipo].forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoriaInput.appendChild(option);
    });
  }

  // Tipos de movimiento

  tipoMovimientoInput.innerHTML =
    '<option value="">Selecciona una opción</option>';
  if (tiposMovimiento[tipo]) {
    tiposMovimiento[tipo].forEach((mov) => {
      const option = document.createElement("option");
      option.value = mov;
      option.textContent = mov;
      tipoMovimientoInput.appendChild(option);
    });
  }
});

// Formulario

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const tipo = tipoInput.value;
  const tipoMovimiento = tipoMovimientoInput.value;
  const monto = parseFloat(montoInput.value);
  const categoria = categoriaInput.value;

  if (!tipo || !tipoMovimiento || !categoria || isNaN(monto) || monto <= 0) {
    alert(
      "Por favor completa todos los campos antes de registrar el movimiento."
    );
    return;
  }

  if (tipo === "ingreso") {
    const ahorro = monto * 0.2;
    const saldoNeto = monto * 0.8;

    agregarFilaTabla(
      "Ingreso",
      tipoMovimiento,
      saldoNeto,
      "positivo",
      categoria
    );
    agregarFilaTabla("Ahorro | 20%", "-", ahorro, "ahorro", "-");

    ingresos += monto;
    ahorros += ahorro;
  } else if (tipo === "gasto") {
    const saldoDisponible = ingresos - gastos - ahorros;

    if (monto > saldoDisponible) {
      alert(
        `No puedes gastar más de lo que tienes disponible.\nSaldo disponible: ${formatearMoneda(
          saldoDisponible
        )}\nMonto del gasto: ${formatearMoneda(monto)}`
      );
      return;
    }

    agregarFilaTabla("Gasto", tipoMovimiento, monto, "negativo", categoria);
    gastos += monto;
  }

  actualizarResumen();
  formulario.reset();
});

// Agregar filas de la tabla

function agregarFilaTabla(
  tipo,
  tipoMovimiento,
  monto,
  claseMonto,
  categoria = ""
) {
  const fila = document.createElement("tr");

  const fechaHora = new Date().toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  fila.innerHTML = `
    <td>${fechaHora}</td>
    <td>${tipo}</td>
    <td>${categoria}</td>
    <td>${tipoMovimiento}</td>
    <td class="${claseMonto}">${formatearMoneda(monto)}</td>
  `;
  tablaBody.appendChild(fila);
}

// Actualizar saldo disponible

function actualizarResumen() {
  ingresosTotal.textContent = formatearMoneda(ingresos);
  gastosTotal.textContent = formatearMoneda(gastos);
  ahorrosTotal.textContent = formatearMoneda(ahorros);

  const saldoDisponible = ingresos - gastos - ahorros;
  saldoDisponibleTotal.textContent = formatearMoneda(saldoDisponible);

  const contenedorTransferencia = document.getElementById("transferirAhorros");
  if (ahorros > 0) {
    contenedorTransferencia.style.display = "block";
  } else {
    contenedorTransferencia.style.display = "none";
  }
}

// Formatear moneda

function formatearMoneda(valor) {
  return `$${Math.round(valor).toLocaleString("es-CO")}`;
}

// Transferencia de ahorros

const transferenciaAhorros = document.getElementById("transferirAhorros");

transferenciaAhorros.addEventListener("click", function () {
  if (ahorros > 0) {
    const montoTransferido = ahorros;
    ahorros = 0;
    actualizarResumen();
    agregarFilaTabla(
      "Retiros de ahorros",
      "-",
      montoTransferido,
      "positivo",
      "-"
    );
    transferenciaAhorros.style.display = "none";
    alert("Los ahorros se han transferido al saldo disponible.");
  } else {
    alert("No hay ahorros para transferir.");
  }
});

let metaDeAhorro = 0;

const metaInput = document.getElementById("metaAhorro");
const guardarMetaBtn = document.getElementById("guardarMeta");
const progresoAhorro = document.getElementById("progresoAhorro");

guardarMetaBtn.addEventListener("click", () => {
  const meta = parseFloat(metaInput.value);
  if (isNaN(meta) || meta <= 0) {
    alert("Ingresa un valor válido para la meta.");
    return;
  }

  metaDeAhorro = meta;
  actualizarResumen();
});