import React from "react";

export default function SidebarSection({
  title,
  children,
  className = "",
  headerClassName = "",
  withTopBorder = false,
}) {
  const sectionClass = [
    withTopBorder && "border-t border-gray-200 dark:border-gray-700 pt-4",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={sectionClass}>
      {title && (
        <h3
          className={[
            "text-gray-600 dark:text-gray-400 font-medium mb-3 px-3",
            headerClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
