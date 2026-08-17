import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

// Sample portfolio data
const portfolioData = [
  {
    id: 1,
    title: "Escultura Abstracta",
    category: "decoration",
    image: "/manus-storage/sculpture-light_f3807002.svg",
    thumbnail: "/manus-storage/sculpture-light_f3807002.svg",
    description: "Escultura de resina con acabado dorado",
    materials: "Resina, pintura acrílica",
    dimensions: "45cm x 30cm x 20cm"
  },
  {
    id: 2,
    title: "Componente Náutico",
    category: "nautical",
    image: "/manus-storage/nautical-flow_d8740c45.svg",
    thumbnail: "/manus-storage/nautical-flow_d8740c45.svg",
    description: "Pieza técnica para aplicación marina",
    materials: "Nylon reforzado",
    dimensions: "60cm x 40cm x 15cm"
  },
  {
    id: 3,
    title: "Objeto de Diseño",
    category: "decoration",
    image: "/manus-storage/sculpture-light_f3807002.svg",
    thumbnail: "/manus-storage/sculpture-light_f3807002.svg",
    description: "Objeto decorativo de autor",
    materials: "Resina, acabado mate",
    dimensions: "30cm x 30cm x 30cm"
  },
  {
    id: 4,
    title: "Prototipo Técnico",
    category: "technical",
    image: "/manus-storage/industrial-precision_8d8efd4f.svg",
    thumbnail: "/manus-storage/industrial-precision_8d8efd4f.svg",
    description: "Prototipo funcional de precisión",
    materials: "PLA + refuerzo de fibra",
    dimensions: "50cm x 35cm x 25cm"
  },
  {
    id: 5,
    title: "Pieza Náutica Decorativa",
    category: "nautical",
    image: "/manus-storage/nautical-flow_d8740c45.svg",
    thumbnail: "/manus-storage/nautical-flow_d8740c45.svg",
    description: "Elemento decorativo con temática marina",
    materials: "Resina, pintura marina",
    dimensions: "40cm x 40cm x 20cm"
  },
  {
    id: 6,
    title: "Escultura Moderna",
    category: "decoration",
    image: "/manus-storage/sculpture-light_f3807002.svg",
    thumbnail: "/manus-storage/sculpture-light_f3807002.svg",
    description: "Escultura contemporánea de autor",
    materials: "Resina, acabado brillante",
    dimensions: "55cm x 35cm x 30cm"
  }
];

type Category = "all" | "decoration" | "nautical" | "technical";

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedItem, setSelectedItem] = useState<typeof portfolioData[0] | null>(null);

  const filteredItems = selectedCategory === "all"
    ? portfolioData
    : portfolioData.filter(item => item.category === selectedCategory);

  const categoryLabels = {
    all: "Todas",
    decoration: "Decoración",
    nautical: "Náutica",
    technical: "Técnica"
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-500 mb-4">Portafolio</h1>
          <p className="text-gray-300 text-lg">Explora nuestras piezas de diseño y componentes técnicos</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {(Object.keys(categoryLabels) as Category[]).map(cat => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${
                selectedCategory === cat
                  ? "bg-amber-600 hover:bg-amber-700 text-black"
                  : "bg-gray-900 hover:bg-gray-800 text-amber-500 border border-amber-600/50"
              } font-semibold`}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card
              key={item.id}
              className="bg-gray-900 border-amber-600/30 overflow-hidden cursor-pointer group hover:border-amber-600/60 transition-all"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-400 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                <p className="text-gray-500 text-xs">{item.materials}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox */}
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
            <DialogContent className="max-w-3xl bg-gray-900 border-amber-600/30">
              <DialogClose className="absolute right-4 top-4 text-amber-500 hover:text-amber-400">
                <X size={24} />
              </DialogClose>

              <div className="grid md:grid-cols-2 gap-8 p-4">
                {/* Image */}
                <div>
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-amber-500 mb-2">{selectedItem.title}</h2>
                    <p className="text-gray-400">{selectedItem.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-amber-500 font-semibold mb-1">Materiales</p>
                      <p className="text-gray-300">{selectedItem.materials}</p>
                    </div>
                    <div>
                      <p className="text-amber-500 font-semibold mb-1">Dimensiones</p>
                      <p className="text-gray-300">{selectedItem.dimensions}</p>
                    </div>
                    <div>
                      <p className="text-amber-500 font-semibold mb-1">Categoría</p>
                      <p className="text-gray-300 capitalize">{categoryLabels[selectedItem.category as Category]}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-600/20">
                    <p className="text-gray-400 text-sm mb-4">¿Interesado en esta pieza?</p>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold">
                      Solicitar Información
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
