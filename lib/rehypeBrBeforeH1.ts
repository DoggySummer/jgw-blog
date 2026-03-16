import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

const brNode = {
  type: "element",
  tagName: "br",
  properties: {},
  children: [],
} as const;

/**
 * 첫 번째 h1을 제외한 모든 h1 앞에 <br />를 삽입합니다.
 * (맨 위 h1에는 br 없음, 두 번째 h1부터 위에 br)
 */
const rehypeBrBeforeH1: Plugin = () => (tree) => {
  let firstH1 = true;
  visit(tree, "element", (node, index, parent) => {
    if ((node as { tagName: string }).tagName !== "h1") return;
    if (firstH1) {
      firstH1 = false;
      return;
    }
    if (parent && typeof index === "number") {
      const p = parent as { children: unknown[] };
      p.children.splice(index, 0, { ...brNode });
    }
  });
};

export default rehypeBrBeforeH1;
