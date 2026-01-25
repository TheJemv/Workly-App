import Contact from "./Contact.types";

interface Profile {
    id: string;
    name: string;
    description: string;
    photo: string;
    contact: Contact
};

export default Profile;
