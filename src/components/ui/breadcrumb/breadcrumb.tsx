import Link from "next/link";

interface BreadcrumbProp {
    items: {
        label: string,
        href: string
    }[]
}

export default function Breadcrumb({ items }: BreadcrumbProp) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                
                return (
                    <div key={index} className="flex items-center gap-2">
                        {isLast ? (
                            <span className="text-gray-600">{item.label}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                {item.label}
                            </Link>
                        )}
                        {!isLast && (
                            <span className="text-gray-400">/</span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
