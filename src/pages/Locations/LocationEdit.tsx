import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLocationById, updateLocation } from "../../services/locationsApi";
import LocationForm from "./LocationForm";
import { LocationDetailDto, LocationCreateDto } from "../../types/Location";

export default function LocationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationDetailDto | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLocationById(Number(id)).then(setLocation);
  }, [id]);

  async function handleSubmit(dto: LocationCreateDto) {
    setSaving(true);
    await updateLocation(Number(id), dto);
    setSaving(false);
    navigate("/locations");
  }

  if (!location) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <LocationForm initialData={location} onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
