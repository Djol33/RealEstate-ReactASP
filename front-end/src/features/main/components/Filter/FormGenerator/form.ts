
export const inputTypes = ["select", "text", "number"];
interface FormField {
  type: string;
  name: string;
  label: string;


}

interface Select extends FormField {
  inputType: "select";
  option: { value: string; label: string }[]
}

interface Range extends FormField {
  inputType: "range";
  option: {   name: string, label: string, type: string }[]

}
interface Text extends FormField {

  inputType: "text";
}

interface Checkbox extends FormField {
  inputType: "checkbox";
  option:{name:string,value:string}[]
}

interface Radiobox extends FormField {
  inputType: "radio";
  option:{name:string,value:string}[]
}


type fieldForm = Text | Select | Range |Checkbox | Radiobox; 

const forma: fieldForm[] = [
  {
    inputType: "select",
    name: "select",
    label: "Type of Property",
    type: "default",
    option: [
      { value: "apartment", label: "Apartment" },
      { value: "house", label: "House" },
      { value: "studio", label: "Studio" },
    ],
  },
  {
    inputType: "text",
    name: "city",
    label: "City",
    type: "default",
  },
  {
    inputType: "text",
    name: "numberOfRooms",
    label: "Number of Rooms",
    type: "default",
  },
  {
    inputType: "range",
    name: "priceRange",
    type: "default",
    label: "Price Range",
    option: [{
      label: "Min Price",
      type: "number",
      name: "minPrice",

    }, {
      label: "Max Price",
      type: "number",
      name: "maxPrice",

    }]
  },
  {
    inputType: "checkbox",
    name: "registered",
    label: "Registered",
    type: "default",
    option: [
      { name: "Yes", value: "yes" },
    ]
  }
]

export default forma;