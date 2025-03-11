import { marked } from "marked";
import DOMPurify from "dompurify";

// Convert markdown to HTML
export const markdownToHtml = async (markdown: string): Promise<string> => {
    const rawHtml = marked(markdown); // Could be string or Promise<string>
    const resolvedHtml = rawHtml instanceof Promise ? await rawHtml : rawHtml; // Resolve if it's a Promise
    return DOMPurify.sanitize(resolvedHtml); // Sanitize the HTML
  };

// Convert HTML to markdown
export const htmlToMarkdown = (html: string): string => {
  // Replace HTML tags with markdown syntax
  return html
    .replace(/<h1>(.*?)<\/h1>/g, "# $1\n\n")
    .replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n")
    .replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n")
    .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
    .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replace(/<em>(.*?)<\/em>/g, "*$1*")
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$2]($1)")
    .replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      return content.replace(/<li>(.*?)<\/li>/g, "- $1\n");
    })
    .replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
      let index = 1;
      return content.replace(/<li>(.*?)<\/li>/g, () => {
        return `${index++}. $1\n`;
      });
    })
    .replace(/<[^>]*>/g, "") // Remove all remaining HTML tags
    .replace(/\n\n\n+/g, "\n\n") // Remove extra newlines
    .trim();
};