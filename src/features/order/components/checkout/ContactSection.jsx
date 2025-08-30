import { PhoneInput as PhoneInputComponent } from '@shared/ui';

export const ContactSection = ({ username, setUsername, phone, setPhone }) => {
  return (
    <>
      <div className="field-wrapper">
        <label htmlFor="name" className="field-label">Имя</label>
        <input type="text" id="name" className="text-field" placeholder="Руслан" required value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <PhoneInputComponent value={phone} onChange={setPhone} label="Номер телефона" placeholder="+996 555 555 555" required={true} />
    </>
  );
};


