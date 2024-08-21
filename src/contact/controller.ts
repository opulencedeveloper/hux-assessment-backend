import { Request, Response } from "express";
import dotenv from "dotenv";

import { MessageResponse } from "../utils/enum";

import { userService } from "../user/service";
import { contactService } from "./service";
import { CustomRequest } from "../utils/interface";
import { ContactParams, IContactInput } from "./interface";

dotenv.config();

class ContactController {
  public async createContact(req: Request, res: Response) {
    const body: IContactInput = req.body;

    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserById(userId);

    if (!userExists) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: "Invalid user.",
        data: null,
      });
    }

    const newContact = await contactService.createContact(body, userId);

    return res.status(201).json({
      status: MessageResponse.Success,
      message: "Contact creation complete.",
      data: newContact ,
    });
  }

  public async retriveContacts(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserById(userId);

    if (!userExists) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: "Invalid user.",
        data: null,
      });
    }

    const contacts = await contactService.fetchContactsByCreatorId(userId);

    return res.status(200).json({
      status: MessageResponse.Success,
      message: "Contacts fetched successfully.",
      data: contacts,
    });
  }

  public async retriveContact(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserById(userId);

    if (!userExists) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: "Invalid user.",
        data: null,
      });
    }

    const contact = await contactService.fetchContactByCreatorId(userId);

    return res.status(200).json({
      status: MessageResponse.Success,
      message: "Contact fetched successfully.",
      data: contact ,
    });
  }

  public async editContact(req: Request, res: Response) {
    const body: IContactInput = req.body;

    const { contactId } = req.params as ContactParams;

    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserById(userId);

    if (!userExists) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: "Invalid user.",
        data: null,
      });
    }

    const updatedContact = await contactService.editContact(body, contactId);

    if (!updatedContact) {
      return res.status(404).json({
        status: MessageResponse.Error,
        message: "Contact not found.",
        data: null,
      });
    }

    return res.status(201).json({
      status: MessageResponse.Success,
      message: "Contact edited successfully.",
      data: updatedContact,
    });
  }

  public async deleteContact(req: Request, res: Response) {
    const { contactId } = req.params as ContactParams;

    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserById(userId);

    if (!userExists) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: "Invalid user.",
        data: null,
      });
    }

    const deletedContact = await contactService.deleteContact(contactId);

    if (!deletedContact) {
      return res.status(404).json({
        status: MessageResponse.Error,
        message: "Contact not found.",
        data: null,
      });
    }

    return res.status(201).json({
      status: MessageResponse.Success,
      message: "Contact deleted successfully.",
      data: null,
    });
  }
}

export const contactController = new ContactController();
