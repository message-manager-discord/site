import React from "react";
import { H1, H2, H3, H4, H5, H6 } from "./mdx/heading";
import { ListItem, OrderedList, UnorderedList } from "./mdx/list";
import Paragraph from "./mdx/paragraph";
import InlineCode from "./mdx/inlineCode";
import Code from "./mdx/code";
import {
  Table,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "./mdx/table";
import Anchor from "./mdx/anchor";

export const COMPONENTS = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  inlineCode: InlineCode,
  code: Code,
  table: Table,
  thead: TableHead,
  th: TableHeader,
  tr: TableRow,
  td: TableData,
  a: Anchor,
};
