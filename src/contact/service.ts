import Contact from "./entity";
import { IContactInput } from "./interface";

class ContactService {
  public async createContact(input: IContactInput, creatorId: string) {
    const { firstName, lastName, phoneNumber } = input;

    const contact = new Contact({
      firstName,
      lastName,
      phoneNumber,
      creatorId,
    });

    const newContact = await contact.save();

    return newContact;
  }

  public async fetchContactsByCreatorId(creatorId: string) {
    const contacts = await Contact.find({ creatorId });

    return contacts;
  }

  public async fetchContactByCreatorId(creatorId: string) {
    const contact = await Contact.findOne({ creatorId });

    return contact;
  }

  public async editContact(input: IContactInput, contactId: string) {
    const { firstName, lastName, phoneNumber } = input;

    let contact = await Contact.findById(contactId);

    if (contact) {
      contact.firstName = firstName;

      contact.lastName = lastName;

      contact.phoneNumber = phoneNumber;

      contact = await contact.save();
    }

    return contact;
  }

  public async deleteContact(contactId: string) {
    const contact = await Contact.findOneAndDelete({ _id: contactId });

    return contact;
  }
}

export const contactService = new ContactService();
