export interface KategorijeUslugeDTO {
    id: number;
    nazivKategorije: string;
    uslugeDTO: UslugeDTO[];
}

export interface UslugeDTO {
    id: number;
    kategorijaUsluge: number;
    nazivUsluge: string;
}

export interface UslugaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (service: any) => void;
    initialData?: {
        id?: number;
        categoryId?: number;
        nameId?: number;
        price?: number;
        lokacijaId?: number;
    };
    salons: Salon[];
    selectedSalonId?: number | null;
    firmaId: number | null;
}

export interface Salon {
    id: number;
    nazivLokacije: string;
}
