function CategoryCard({
  name,
  thumbnailURL,
}: {
  name: string;
  thumbnailURL: string;
}) {
  return (
    <div className="flex items-center h-[60px] rounded-lg bg-white border border-[#e6f0f2] pl-[15px] hover:cursor-pointer hover:shadow-[0px_0px_10px_rgba(0,0,0,0.25)]">
      <img
        // src="https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp"
        src={thumbnailURL}
        height={30}
        width={40}
      />
      <span>{name}</span>
    </div>
  );
}

export default CategoryCard;
