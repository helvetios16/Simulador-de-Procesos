import React, { FC } from "react";

type JsonUploaderProps = {
  onJsonParsed: (json: object) => void;
  onError: (error: string) => void;
};

export const JsonUploader: FC<JsonUploaderProps> = ({
  onJsonParsed,
  onError,
}) => {
  const createWorker = () => {
    const workerCode = `
      self.onmessage = async (event) => {
        const file = event.data;
        try {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const json = JSON.parse(reader.result);
              self.postMessage({ success: true, data: json });
            } catch (error) {
              self.postMessage({ success: false, error: "Error al parsear el JSON" });
            }
          };
          reader.onerror = () => {
            self.postMessage({ success: false, error: "Error al leer el archivo" });
          };
          reader.readAsText(file);
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      onError("Por favor, selecciona un archivo.");
      return;
    }

    if (file.type !== "application/json") {
      onError("Por favor, selecciona un archivo JSON válido.");
      return;
    }

    const worker = createWorker();

    worker.onmessage = (messageEvent) => {
      const { success, data, error } = messageEvent.data;
      if (success) {
        onJsonParsed(data);
      } else {
        onError(error);
      }
      worker.terminate();
    };

    worker.postMessage(file);
  };

  return (
    <div>
      <h3>Cargar archivo JSON</h3>
      <input
        type="file"
        accept="application/json"
        onChange={handleFileUpload}
      />
    </div>
  );
};
