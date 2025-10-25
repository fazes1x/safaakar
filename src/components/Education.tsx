import { Leaf, Car, Home, ShoppingBag, Utensils } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';

export function Education() {
  const { language } = useAuth();
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {t.carbonFootprint}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {t.carbonIntro}
          </p>
        </div>

        <div className="space-y-8">
          <section className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <Car className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">
                {t.transportation}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t.transportationDesc}
            </p>
          </section>

          <section className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <Home className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">{t.energy}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t.energyDesc}
            </p>
          </section>

          <section className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <Utensils className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">{t.food}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t.foodDesc}
            </p>
          </section>

          <section className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingBag className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">{t.clothing}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t.clothingDesc}
            </p>
          </section>

          <section className="bg-green-50 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-green-800 mb-3">
              {t.conclusion}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t.conclusionDesc}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
