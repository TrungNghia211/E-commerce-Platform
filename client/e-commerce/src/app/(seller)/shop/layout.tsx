const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div
        style={{
          height: 56,
          backgroundColor: "#0066cc",
          color: "white",
          marginBottom: 10,
        }}
      >
        Kênh người bán
      </div>
      {children}
    </div>
  );
};

export default AdminLayout;
