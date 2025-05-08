import { useState, useRef } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

import "./index.css";

const INVESTORS_API = "/api/investors";

const formFields = [
  ["first_name", "First Name", "text"],
  ["last_name", "Last Name", "text"],
  ["date_of_birth", "Date of Birth", "date"],
  ["phone_number", "Phone Number", "tel"],
];

const initialFormState = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  phone_number: "",
  street_address: "",
  state: "",
  zip_code: "",
};

export default function App() {
  const [form, setForm] = useState(initialFormState);
  const [address, setAddress] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleChangeField = (e) =>
    setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));

  const handleSelect = async (selectedAddress) => {
    setAddress(selectedAddress);
    setForm((prevForm) => ({ ...prevForm, street_address: selectedAddress }));

    try {
      const results = await geocodeByAddress(selectedAddress);
      const addressComponents = results[0].address_components;
      const stateComponent = addressComponents.find((c) =>
        c.types.includes("administrative_area_level_1")
      );
      const zipComponent = addressComponents.find((c) =>
        c.types.includes("postal_code")
      );

      setForm((prevForm) => ({
        ...prevForm,
        state: stateComponent?.short_name || "",
        zip_code: zipComponent?.long_name || "",
      }));
    } catch (err) {
      console.error("Address parse failed", err);
    }
  };

  const handleFiles = (e) => setFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    Array.from(files).forEach((file) => data.append("documents", file));

    const res = await fetch(INVESTORS_API, {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      setForm(initialFormState);
      setAddress("");
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
      console.warn("Submit form error", await res.text());
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border-2 border-gray-500 mt-8">
      <h1 className="text-2xl font-bold mb-6">Investor Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map(([name, label, type]) => (
          <div key={name}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChangeField}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Street Address</label>
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
            searchOptions={{ componentRestrictions: { country: "us" } }}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Start typing your address...",
                    className: "w-full border border-gray-300 rounded p-2",
                    required: true,
                  })}
                />
                {suggestions.length > 0 && (
                  <div className="bg-white border border-gray-200 mt-1 rounded">
                    {loading && <div className="p-2">Loading…</div>}
                    {suggestions.map((s) => (
                      <div
                        key={s.placeId}
                        {...getSuggestionItemProps(s)}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {s.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
        </div>

        <input type="hidden" name="state" value={form.state} />
        <input type="hidden" name="zip_code" value={form.zip_code} />

        <div>
          <label className="block mb-1 font-medium">Documents</label>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFiles}
            required
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
