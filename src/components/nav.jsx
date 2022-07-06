import { Navbar } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import { Avatar } from "flowbite-react";
import { NavLink } from "react-router-dom";
import logo from '../logo.svg'

const USER_MODEL = {
    name:"Gui",
    username:"guinetik"
}

const DROPDOWN_ITEMS = [
  {
    title: "Random Planet",
    key: "/",
    show: "always",
  },
  {
    title: "Account",
    key: "account",
    show: "signedin",
  },
  {
    title: "My Reviews",
    key: "my-reviews",
    show: "signedin",
  },
  {
    title: "Sign Out",
    key: "signout",
    show: "signedin",
    divider: true,
  },
];

const NAV_ITEMS = [
  {
    title: "Home",
    key: "/",
  },
  {
    title: "Kepler Stars",
    key: "stars",
  },
  {
    title: "Kepler Planets",
    key: "planets",
  },
  {
    title: "Pic of the Day",
    key: "apod",
  },
  {
    title: "About",
    key: "about",
  },
];
export default function KeplerNav() {
  let signedin = true;

  return (
    <Navbar fluid={true} rounded={true} className="z-10">
      <Navbar.Brand href="/">
        <img
          src={logo}
          className="mr-3 h-6 sm:h-9"
          alt="Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Exoplanets Review
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 z-50">
        <NavDropDown items={DROPDOWN_ITEMS} signed_in={signedin} user={USER_MODEL} />
        <Navbar.Toggle />
      </div>
      <MainNav items={NAV_ITEMS}/>
    </Navbar>
  );
}

/**
 * Lets reduce frontend boiler plate by creating a functional component for the nav
 * @param {items} props
 * @returns A functional component to render the main nav. uses flowbite's <Navbar.Collapse>
 */
const MainNav = (props) => {
  //console.log("MainNav", props.items);
  const navItems = props.items.map((item) => {
    return <MainNavItem key={item.key} title={item.title} link={item.key} />;
  });
  //console.log(navItems);
  return <Navbar.Collapse>{navItems}</Navbar.Collapse>;
};

/**
 * Each main nav item render as a <NavLink>
 * @param {link, title} props
 * @returns A functional component to render a nav Item
 */
const MainNavItem = (props) => {
  //console.log("MainNavItem", props);
  return (
    <NavLink
      to={props.link}
      className="block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
    >
      {props.title}
    </NavLink>
  );
};

const NavDropdownHeader = (props) => {
  if (props.isSignedIn) {
    return (
      <Dropdown.Header className="z-50">
        <span className="block text-sm">{props.user.name}</span>
        <span className="block truncate text-sm font-medium">
          @{props.user.username}
        </span>
      </Dropdown.Header>
    );
  } else {
    return (
      <Dropdown.Header className="z-50">
        <Dropdown.Item>Sign In</Dropdown.Item>
        <Dropdown.Item>Sign Up</Dropdown.Item>
      </Dropdown.Header>
    );
  }
};

const NavDropDown = (props) => {
  const isSignedIn = props.signed_in;
  console.log("NavDropDown", isSignedIn, props.items);
  const dropdownItems = props.items.map((item) => {
    if (
      item.show === "always" ||
      (item.show === "signedin" && isSignedIn) ||
      (item.show === "signedout" && !isSignedIn)
    ) {
      console.log("showing", item.title);
      if (item.divider) {
        return (
          <div key={item.key}>
            <Dropdown.Divider />
            <Dropdown.Item>{item.title}</Dropdown.Item>
          </div>
        );
      } else {
        return <Dropdown.Item key={item.key}>{item.title}</Dropdown.Item>;
      }
    } else return null;
  });
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      label={
        <Avatar
          alt="User settings"
          img="https://ui-avatars.com/api/?name=John+Doe"
          rounded={true}
        />
      }
    >
      <NavDropdownHeader isSignedIn={isSignedIn} user={props.user} />
      {dropdownItems}
    </Dropdown>
  );
};
