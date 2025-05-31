function CategoryCard({
  name,
  thumbnailURL,
}: {
  name: string;
  thumbnailURL: string;
}) {
  return (
    <div className="flex items-center h-[60px] rounded-lg bg-white border border-[#e6f0f2] pl-[15px] hover:cursor-pointer hover:shadow-[0px_0px_10px_rgba(0,0,0,0.25)]">
      <img src={thumbnailURL} height={30} width={40} />
      <span className="ml-[5px]">{name}</span>
    </div>
  );
}

export default CategoryCard;
