import { GitPullRequestCreate } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CustomButton from "../base/Button";
import { useState } from "react";
import { FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import CustomSelect from "../base/Select";
import { useCities } from "../../hooks/useCity";
import type { TravelRequest } from "../../types/travel";

const PerdinDialog = ({
  open,
  onSubmit,
  onOpenChange,
}: {
  open: boolean;
  onSubmit: (a: TravelRequest) => void;
  onOpenChange: (v: boolean) => void;
}) => {
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [description, setDescription] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");

  const { cities, isLoading: loadingCities } = useCities();

  const handleSubmitBtn = () => {
    onSubmit({
      departure_date: departureDate,
      return_date: returnDate,
      origin_city_id: Number(originCity),
      destination_city_id: Number(destinationCity),
      description,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-md lg:min-w-2xl max-w-2xl mx-auto px-4 md:px-6 lg:px-8 pt-10 rounded-2xl border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <DialogTitle className="font-display text-lg font-bold">
            Tambah Perdin
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <FieldGroup>
            <CustomSelect
              label="Kota Asal"
              options={cities}
              value={originCity}
              onChange={setOriginCity}
              placeholder={loadingCities ? "Memuat..." : "Pilih kota asal"}
            />
            <CustomSelect
              label="Kota Tujuan"
              options={cities}
              value={destinationCity}
              onChange={setDestinationCity}
              placeholder={loadingCities ? "Memuat..." : "Pilih kota tujuan"}
            />
            <Field>
              <FieldLabel>Tanggal Berangkat</FieldLabel>
              <Input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Tanggal Kembali</FieldLabel>
              <Input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Keterangan</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              ></textarea>
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 sm:gap-2">
          <CustomButton variant="outline" onClick={() => onOpenChange(false)}>
            Batalkan
          </CustomButton>

          <CustomButton onClick={handleSubmitBtn}>
            <GitPullRequestCreate size={14} /> Ajukan Perdin
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PerdinDialog;
