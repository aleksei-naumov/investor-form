import { useState } from "react";

import "./index.css";

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

  const handleChangeField = (e) =>
    setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));

  return (
    <div className="max-w-xl mx-auto p-6 border-2 border-gray-500 mt-8">
      <h1 className="text-2xl font-bold mb-6">Investor Form</h1>
      <form className="space-y-4">
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
      </form>
    </div>
  );
}
