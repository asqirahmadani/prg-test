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
import type { CityRequest } from "../../types/city";

const CityDialog = ({
  open,
  onSubmit,
  onOpenChange,
}: {
  open: boolean;
  onSubmit: (a: CityRequest) => void;
  onOpenChange: (v: boolean) => void;
}) => {
  const [cityName, setCityName] = useState("");
  const [province, setProvince] = useState("");
  const [island, setIsland] = useState("");
  const [isAbroad, setIsAbroad] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleSubmitBtn = () => {
    onSubmit({
      name: cityName,
      province: province,
      island: island,
      is_abroad: isAbroad,
      latitude: latitude,
      longitude: longitude,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-md lg:min-w-2xl max-w-2xl mx-auto px-4 md:px-6 lg:px-8 pt-10 rounded-2xl border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <DialogTitle className="font-display text-lg font-bold">
            Tambah Kota
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <FieldGroup>
            <Field>
              <FieldLabel>Nama Kota</FieldLabel>
              <Input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Provinsi</FieldLabel>
              <Input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Pulau</FieldLabel>
              <Input
                type="text"
                value={island}
                onChange={(e) => setIsland(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Luar Negeri</FieldLabel>
              <Input
                type="checkbox"
                value={String(isAbroad)}
                onChange={(e) => setIsAbroad(Boolean(e.target.value))}
              />
            </Field>

            <Field>
              <FieldLabel>Latitude</FieldLabel>
              <Input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.valueAsNumber)}
              />
            </Field>

            <Field>
              <FieldLabel>Longitude</FieldLabel>
              <Input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.valueAsNumber)}
              />
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 sm:gap-2">
          <CustomButton variant="outline" onClick={() => onOpenChange(false)}>
            Batalkan
          </CustomButton>

          <CustomButton onClick={handleSubmitBtn}>
            <GitPullRequestCreate size={14} /> Buat
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CityDialog;
