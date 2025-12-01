import MarketsMenu from "@/src/components/Markets/MarketsMenu";

export default function MarketsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <MarketsMenu />
            {children}
        </div>
    );
}
