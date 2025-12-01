import MarketsMenu from "@/src/components/Markets/MarketsMenu";

export default function MarketsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ padding: '24px 2.5%', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
            <MarketsMenu />
            {children}
        </div>
    );
}
