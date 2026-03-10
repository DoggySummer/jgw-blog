import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Node, Parent } from "unist";

interface DirectiveNode extends Node {
  type: string;
  name?: string;
  attributes?: Record<string, string>;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
  children?: Node[];
}

const remarkCallout: Plugin = () => {
  return (tree) => {
    visit(tree, (node: Node) => {
      const d = node as DirectiveNode;
      if (
        d.type === "containerDirective" &&
        ["info", "warning", "tip", "danger"].includes(d.name ?? "")
      ) {
        d.data = d.data || {};
        d.data.hName = "div";
        d.data.hProperties = { "data-callout": d.name };
      }
    });
  };
};

export default remarkCallout;
