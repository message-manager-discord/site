import { isConstructorTypeNode } from "typescript";

enum GetReportsStatus {
  PENDING = "pending",
  ASSIGNED = "assigned",
  SPAM = "spam",
  INVALID = "invalid",
  ACTIONED = "actioned",
  OPEN = "open",
  CLOSED = "closed",
  ALL = "all",
}

type ReportStatus = "pending" | "spam" | "actioned" | "invalid";

enum Action {
  GUILD_BAN = "guild_ban",
  USER_BAN = "user_ban",
  WARNING = "warning",
  DELETE = "delete",
}

interface ReportMessage {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  staff_only?: boolean;
  staff_id?: string;
}

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
}

interface EmbedFooter {
  text: string;
  icon_url?: string;
}

interface EmbedThumbnail {
  url: string;
}

interface Embed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;

  timestamp?: string;
  author?: EmbedAuthor;
  footer?: EmbedFooter;
  thumbnail?: EmbedThumbnail;
  fields?: EmbedField[];
}

interface Report {
  id: string;
  title: string;
  status: ReportStatus;
  action?: Action;
  reason: string;
  reporting_user_id: string;
  assigned_staff_id?: string;
  guild_id: string;
  messages: ReportMessage[];
  created_at: string;
  updated_at: string;
  guild_data: {
    icon?: string;
    name?: string;
    past_warning_count?: number;
    past_appealed_ban_count?: number;
    banned?: boolean;
  };
  reported_message: {
    id: string;
    content?: string;
    embed?: Embed;
    author_id?: string;
    created_at: string;
    edit_count?: number;
  };
  other_reports_on_same_message?: string[];
  staff_view: boolean;
}

export { GetReportsStatus };
export type { Report, ReportMessage };
