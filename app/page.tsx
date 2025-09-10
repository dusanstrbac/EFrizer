import SideNavigation from "@/components/SideNavigation";
import Kalendar from "@/components/ui/Kalendar";

export default function Home() {
  // Funkcija koja dobija današnji datum
  const today = new Date();

  // Formatiranje datuma u obliku "9. septembar 2025" na latinici
  const formattedDate = today.toLocaleDateString('sr-Latn-RS', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex h-[100vh]">
      {/* SideNavigation - zauzima konstantnu širinu */}
      <div className="w-[250px]">
        <SideNavigation />
      </div>

      {/* Kalendar - zauzima preostali prostor */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="border-b border-gray-300 pb-4">
          <div className="flex justify-between items-center">
            {/* Radno vreme i datum u kompaktnom formatu */}
            <div className="flex items-center space-x-4">
              <h3 className="text-sm font-medium text-gray-600">Radno vreme:</h3>
              <h3 className="text-sm font-bold">Pon - Sub, 08:00 - 20:00</h3>
            </div>

            <div className="flex items-center space-x-4">
              <h3 className="text-sm font-bold">{formattedDate}</h3> {/* Prikazivanje današnjeg datuma */}
            </div>
          </div>
        </div>
        <Kalendar />
      </div>
    </div>
  );
}
