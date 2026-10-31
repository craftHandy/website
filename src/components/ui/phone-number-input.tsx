"use client";

import PhoneInput, { type CountryData } from "react-phone-input-2";
import { isValidPhoneNumber } from "libphonenumber-js";

export function isValidInternationalPhone(value: string): boolean {
  return isValidPhoneNumber(value);
}

type PhoneNumberInputProps = {
  value: string;
  onChange: (value: string, country: CountryData | undefined) => void;
  country?: string;
  invalid?: boolean;
  id?: string;
  name?: string;
};

export function PhoneNumberInput({
  value,
  onChange,
  country = "in",
  invalid = false,
  id,
  name = "phone",
}: PhoneNumberInputProps) {
  return (
    <PhoneInput
      country={country}
      value={value}
      onChange={(digits, countryData) => {
        const country = "dialCode" in countryData ? countryData as CountryData : undefined;
        onChange(digits ? `+${digits}` : "", country);
      }}
      isValid={(digits, countryData) => {
        const country = countryData as CountryData;
        return Boolean(country?.dialCode) && isValidInternationalPhone(`+${digits}`);
      }}
      enableSearch
      countryCodeEditable={false}
      inputProps={{ id, name, autoComplete: "tel", required: true }}
      containerStyle={{ width: "100%" }}
      inputStyle={{
        width: "100%",
        height: "44px",
        background: "var(--color-surface)",
        color: "var(--color-foreground)",
        border: `1px solid ${invalid ? "#f87171" : "var(--color-border-subtle)"}`,
        borderRadius: "4px",
        fontFamily: "inherit",
        fontSize: "14px",
      }}
      buttonStyle={{
        background: "var(--color-surface)",
        borderColor: invalid ? "#f87171" : "var(--color-border-subtle)",
        borderRadius: "4px 0 0 4px",
      }}
      dropdownStyle={{ zIndex: 60 }}
    />
  );
}
