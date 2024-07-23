import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Item({
  Icon,
  name = '',
  href = '',
}) {
  useEffect(() => {
    if (window.location.pathname === "/all-orders") {
        window.location.reload();
    }
}, []);
  return (
    <Link to={href}>
      <div className="flex items-center py-2 gap-3 bg-inherit cursor-pointer">
        <Icon size={26} weight="duotone" />
        <p className="font-bold tracking-wide">{name}</p>
      </div>
    </Link>
  );
}
