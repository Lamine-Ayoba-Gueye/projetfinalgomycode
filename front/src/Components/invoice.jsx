import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React from "react";

export default function InvoicePdf() {
    const printRef = React.useRef(null);

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        if (!element) {
            return;
        }

        const canvas = await html2canvas(element, {
            scale: 2,
        });
        const data = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
        });

        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("reservation.pdf");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
                <div ref={printRef} className="p-8 bg-white border border-gray-200">

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Facturer Réservation
                        </h3>
                        <p className="text-gray-700">
                            Nom du client
                            <br />
                            Nom du Chauffeur
                        </p>
                    </div>

                    <table className="w-full mb-8 border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Engin</th>
                                <th className="border p-2 text-right">Numéro Engin</th>
                                <th className="border p-2 text-right">Numéro Plaque</th>
                                <th className="border p-2 text-right">Debut</th>
                                <th className="border p-2 text-right">Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border p-2"> Service</td>
                                <td className="border p-2 text-right">1</td>
                                <td className="border p-2 text-right">$1,500.00</td>
                                <td className="border p-2 text-right">$1,500.00</td>
                                <td className="border p-2 text-right">$1,500.00</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-64">

                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>$1,925.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleDownloadPdf}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}