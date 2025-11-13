import { useNavigate } from "react-router-dom";
import LocationForm from "./LocationForm";
import { createLocation } from "../../services/locationsApi";
import { LocationCreateDto } from "../../types/Location";

export default function LocationCreate() {
  const navigate = useNavigate();

  async function handleSubmit(dto: LocationCreateDto) {
    await createLocation(dto);
    navigate("/locations");
  }

  return (
    <div className="p-6">
      <LocationForm onSubmit={handleSubmit} />
    </div>
  );
}
