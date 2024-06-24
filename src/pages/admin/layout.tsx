import AdminSideBar from '@/components/admin';
import { AuthenticateUser } from '@/utils/protecteRoutes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';

const AdminLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const user = await AuthenticateUser();
      if (!user) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }
    getUser();
  }, []);

  const router = useRouter();
  const { pathname, query } = router;
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  const toTitleCase = (str) => {
    return str.replace(/\b\w+/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const breadcrumbItems = pathSegments.map((segment, index) => {
      let breadcrumbSegment;
      
      
      // Check if it's a slug parameter and replace it with its value
      if (segment.startsWith('[') && segment.endsWith(']') && query[segment.slice(1, -1)]) {
          pathSegments[index] = query[segment.slice(1, -1)].toString();
          breadcrumbSegment = pathSegments[index];  
      }
      else {
          breadcrumbSegment = toTitleCase(segment);
      }

    let routePath = `/${pathSegments.slice(0, index + 1).join('/')}`;

    return (
      <Breadcrumb.Item
        className="admin_breadcrumb"
        key={index}
        onClick={() => {
          if (breadcrumbSegment !== "User") {
            router.push(routePath);
          }
        }}
        active={index === pathSegments.length - 1}
      >
        {breadcrumbSegment === "Admin" ? "Home" : breadcrumbSegment}
      </Breadcrumb.Item>
    );
  });

  return (
    <>
      {!isLoading && (
        <>
          <div style={{ height: "100vh", display: "flex", gap:"80px" }}>
            <div id="adminSidebar">
              <AdminSideBar />
            </div>
            <div className="row d-flex flex-column flex-nowrap w-100">
              <div className="px-4">
                <Breadcrumb>{breadcrumbItems}</Breadcrumb>
              </div>
              <div>{children}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminLayout;
