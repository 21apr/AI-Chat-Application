export interface Chat {
  _id?: string;
  name?: string;
  messages: Message[];
  lastUpdated: Date;
  user: string;
  file?: {
    name: string;
    content: string;
  };
}

export interface Message {
  _id?: string;
  question: string;
  answer: string;
  file?: {
    name: string;
    content: string;
  };
}
