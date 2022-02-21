import useLocalStorage from "./useLocalStorage";

const useFormLocalStorage = (key, initialFormValues) => {
  const [formData, setFormData] = useLocalStorage(key, initialFormValues);

  return [
    formData,
    e => setFormData({ ...formData, [e.target.name]: e.target.value })
  ]
}

export default useFormLocalStorage;