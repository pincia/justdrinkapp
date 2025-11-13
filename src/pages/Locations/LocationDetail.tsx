import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLocationById } from "../../services/locationsApi";
import LocationForm from "./LocationForm";
import { LocationDetailDto } from "../../types/Location";

export default function LocationDetail() {
  const { id } = useParams();
  const [location, setLocation] = useState<LocationDetailDto | null>(null);

  useEffect(() => {
    getLocationById(Number(id)).then(setLocation);
  }, [id]);

  if (!location) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <LocationForm initialData={location} readOnly />
    </div>
  );
}
