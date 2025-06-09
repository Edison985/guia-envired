import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Home,
  Info,
  Weight,
  DollarSign,
} from "lucide-react";

export default function App() {
  const [guia, setGuia] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vista, setVista] = useState("info");
  const [vistaInicial, setVistaInicial] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(
        `https://api.postalservice.fivesoft.com.co/fivepostal/api/v1.0/public/tag/${guia}`
      );
      const result = await res.json();
      if (!result.success)
        throw new Error("No se encontr\u00f3 informaci\u00f3n.");
      setData(result);
      setVistaInicial(false);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const getEstado = () => {
    if (!data) return 1;
    if (data.data.typereturn_name === "ENTREGADO") return 3;
    if (data.data.typestate_general === 2) return 2;
    return 1;
  };

  const formatearFecha = (str) => {
    const d = new Date(str);
    return d.toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 font-sans flex flex-col items-center justify-start relative overflow-hidden">
      <div
        className={`max-w-4xl w-full bg-white shadow-md rounded p-6 transform transition-all duration-700 ease-in-out ${
          vistaInicial ? "translate-y-[30vh]" : "translate-y-0"
        }`}
      >
        <div className="flex flex-col items-center mb-4">
          <img
            src="https://enviredtunja.com/wp-content/uploads/2025/04/cropped-lOGO.png"
            alt="Logo"
            className="w-32 h-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-center">
            Seguimiento de Envíos
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Número de guía"
            value={guia}
            onChange={(e) => setGuia(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Consultar
          </button>
        </div>

        {loading && <p className="text-center text-blue-600">Cargando...</p>}

        {error && !error.includes("<!DOCTYPE") && (
          <p className="text-center text-red-600 font-semibold bg-red-100 border border-red-300 rounded py-2 px-4">
            {error === "No se encontró información."
              ? "Número de guía inválido. Verifique e intente nuevamente."
              : error}
          </p>
        )}
        {data && (
          <>
            {/* Progreso */}
            <div className="flex items-center justify-between mb-6">
              {/* Paso 1 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getEstado() >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-xs mt-1 font-medium">Recibido</p>
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${
                  getEstado() >= 2 ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
              <div className="flex flex-col items-center text-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getEstado() >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <p className="text-xs mt-1 font-medium">En Ruta</p>
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${
                  getEstado() === 3 ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
              <div className="flex flex-col items-center text-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getEstado() === 3 ? "bg-blue-600 text-white" : "bg-gray-300"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-xs mt-1 font-medium">Entregado</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-gray-500 font-semibold mb-1">
                    Origen
                  </h3>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {data.data.origin_name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {formatearFecha(data.data.date_time_start)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-semibold mb-1">
                    Destino
                  </h3>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    {data.data.destiny_name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {formatearFecha(data.data.date_time_present)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-6 justify-center">
              <button
                onClick={() => setVista("info")}
                className={`flex-1 px-4 py-2 rounded font-medium text-center ${
                  vista === "info"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Información del Envío
              </button>
              <button
                onClick={() => setVista("historial")}
                className={`flex-1 px-4 py-2 rounded font-medium text-center ${
                  vista === "historial"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Historial de Envío
              </button>
              <button
                onClick={() => setVista("guia")}
                className={`flex-1 px-4 py-2 rounded font-medium text-center ${
                  vista === "guia"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Guía
              </button>
            </div>

            {vista === "guia" && (
              <div className="bg-white rounded p-4 shadow border text-sm text-gray-700 space-y-2">
                {data.data_image_scan && (
                  <div className="mt-4">
                    <p className="font-semibold mb-1">Imagen Digitalizada</p>
                    <a
                      href={`https://public.postalservice.fivesoft.com.co/${data.data_image_scan}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`https://public.postalservice.fivesoft.com.co/${data.data_image_scan}`}
                        alt="Guía escaneada"
                        className="w-full border rounded shadow cursor-pointer transition hover:brightness-95"
                      />
                    </a>
                    <br />

                    <p>
                      <span className="font-semibold">Número de Guía:</span>{" "}
                      {data.data.tagid}
                    </p>
                    <p>
                      <span className="font-semibold">Remitente:</span>{" "}
                      {data.data.sender_name}
                    </p>
                    <p>
                      <span className="font-semibold">Destinatario:</span>{" "}
                      {data.data.reseiver_name}
                    </p>
                    <p>
                      <span className="font-semibold">Origen:</span>{" "}
                      {data.data.origin_name}
                    </p>
                    <p>
                      <span className="font-semibold">Destino:</span>{" "}
                      {data.data.destiny_name}
                    </p>
                    <p>
                      <span className="font-semibold">Peso:</span>{" "}
                      {data.data.weight} kg
                    </p>
                    <p>
                      <span className="font-semibold">Valor:</span> $
                      {data.data.value_total.toLocaleString("es-CO")}
                    </p>
                    <p>
                      <span className="font-semibold">Estado:</span>{" "}
                      {data.data.type_state_name}
                    </p>
                    <p>
                      <span className="font-semibold">Fecha de ingreso:</span>{" "}
                      {formatearFecha(data.data.date_time_start)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {vista === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Remitente</h4>
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    {data.data.sender_name}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {data.data.sender_phone}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Home className="w-4 h-4" />
                    {data.data.sender_address}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Destinatario</h4>
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    {data.data.reseiver_name}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {data.data.reseiver_phone !== "0"
                      ? data.data.reseiver_phone
                      : "No disponible"}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Home className="w-4 h-4" />
                    {data.data.reseiver_address}
                  </p>
                </div>

                <div className="md:col-span-2 bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">
                    Información del Paquete
                  </h4>
                  <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-blue-500" />
                      Peso: {data.data.weight} kg
                    </p>
                    <p className="flex items-center gap-2 justify-center mx-auto">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      Valor total: $
                      {data.data.value_total.toLocaleString("es-CO")}
                    </p>
                    <p className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-500" />
                      Observación: {data.data.observation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {vista === "historial" && (
              <div>
                <h4 className="font-semibold mb-3">Historial de Envío</h4>

                <div className="relative pl-6 space-y-6">
                  <div className="absolute top-0 left-4 bottom-0 w-0.5 bg-blue-500"></div>
                  {data.data_track
                    .filter((e) => e.type_state_name !== "ENTREGA SIN IMAGEN")
                    .map((e, i) => (
                      <div key={i} className="relative flex gap-4">
                        <div className="w-5 h-5 rounded-full border-4 border-blue-500 bg-white mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="mb-1 text-sm">
                            <span className="font-semibold text-blue-600">
                              {e.type_state_name === "INGRESADA EN POS"
                                ? "INGRESADA EN PUNTO DE ORIGEN"
                                : e.type_state_name}
                            </span>
                            <span className="text-gray-500 ml-2">
                              {formatearFecha(e.dete_time)}
                            </span>
                          </div>

                          {/* Motivo de devolución visible solo en GESTIONADA */}
                          {e.type_state_name === "GESTIONADA" &&
                            e.type_return_name && (
                              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-2">
                                <h4 className="font-semibold mb-1 text-yellow-700">
                                  Motivo
                                </h4>
                                <p className="text-yellow-800 font-medium">
                                  {e.type_return_name}
                                </p>
                              </div>
                            )}

                          {(() => {
                            const cleanExplanation = e.explanation
                              ?.replace(/<[^>]*>/g, "") // quitar etiquetas HTML
                              .replace(/\s+/g, "") // quitar espacios
                              .trim()
                              .toLowerCase();

                            if (
                              cleanExplanation &&
                              cleanExplanation !== "correccion:"
                            ) {
                              let html =
                                e.type_state_name === "Certificacion" ||
                                e.type_state_name === "EN BODEGA ORIGEN"
                                  ? e.explanation
                                      ?.replace(/<button.*?<\/button>/gi, "")
                                      .replace(/<li>Usuario:.*?<\/li>/gi, "")
                                      .replace(/<li>Nombre:.*?<\/li>/gi, "")
                                      .replace(/<li>Mail:.*?<\/li>/gi, "")
                                      .replace(/<li>Perfil:.*?<\/li>/gi, "")
                                      .replace(
                                        /<ul><b>Usuario que realiza el proceso:.*?<\/ul>/gi,
                                        ""
                                      )
                                  : e.explanation
                                      ?.replace(/<button.*?<\/button>/gi, "")
                                      .replace(/<li>Usuario:.*?<\/li>/gi, "")
                                      .replace(/<li>Nombre:.*?<\/li>/gi, "")
                                      .replace(/<li>Mail:.*?<\/li>/gi, "")
                                      .replace(
                                        /<ul><b>Usuario que realiza el proceso:.*?<\/ul>/gi,
                                        ""
                                      )
                                      .replace(
                                        /<li>Perfil:.*?<\/li>\s*<li>(?!Fecha de proceso).*?<\/li>/gi,
                                        ""
                                      );

                              if (e.type_state_name === "REENVIO") {
                                html = html?.split("Perfil:")[0]; // Corta todo desde "Perfil:"
                                html += "</div>"; // Asegura cierre del contenedor si era <div> abierto
                              } else if (
                                e.type_state_name === "EN DISTRIBUCION" &&
                                e.city_name
                              ) {
                                html = html?.replace(
                                  /<\/ul>/i,
                                  `<li>Ciudad: ${e.city_name}</li></ul>`
                                );
                              }

                              return (
                                <div
                                  className="bg-blue-50 text-sm text-gray-700 rounded p-3"
                                  dangerouslySetInnerHTML={{ __html: html }}
                                />
                              );
                            }

                            return null;
                          })()}

                          {e.type_state_name === "GUIA DIGITALIZADA" &&
                            data.data_image_scan && (
                              <div>
                                <a
                                  href={`https://public.postalservice.fivesoft.com.co/${data.data_image_scan}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-medium"
                                >
                                  Ver imagen digitalizada
                                </a>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
