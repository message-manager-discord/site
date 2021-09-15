import { join } from "path";
import fs from "fs";

export interface DocsDirectoryNames {
  dirname: string;
  filenames: string[];
}

export const getAllDocPages = async (): Promise<DocsDirectoryNames[]> => {
  const docsDirectory = join(process.cwd(), "pages/docs");
  const docsDirs = fs.readdirSync(docsDirectory);
  let output: DocsDirectoryNames[] = [];
  docsDirs.forEach((dirPath) => {
    const currentDir = join(docsDirectory, dirPath);
    if (fs.lstatSync(currentDir).isDirectory()) {
      const MDXFiles = fs
        .readdirSync(currentDir)
        .filter((file) => file.endsWith(".mdx"));
      const cleanedMDXFiles = MDXFiles.map((file) =>
        file.substr(0, file.length - 4),
      );
      output.push({
        dirname: dirPath,
        filenames: cleanedMDXFiles,
      });
    }
  });
  return output;
};
