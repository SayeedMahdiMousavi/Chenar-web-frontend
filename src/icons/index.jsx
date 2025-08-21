import React from 'react';
// Import specific icons from react-icons for existing exports
import { FaUsers, FaDollarSign, FaWallet, FaShoppingCart, FaCreditCard, FaCalculator, FaCcVisa, FaPaypal, FaMoneyBillWave, FaUniversity, FaCcMastercard } from 'react-icons/fa';
import { MdExpandMore, MdExpandLess, MdSunny, MdDarkMode, MdNotifications, MdSwapHoriz, MdOutlinePreview } from 'react-icons/md';
import { BsFillPersonFill, BsFillLockFill, BsFillCalendarFill, BsGlobe, BsCashCoin } from 'react-icons/bs';
import { AiFillCheckCircle, AiFillCloseCircle, AiFillEdit, AiFillDelete, AiFillSave } from 'react-icons/ai';
import { BiTransfer, BiDotsHorizontalRounded, BiChevronDown, BiPlus, BiLogOut, BiPrinter, BiBarcode } from 'react-icons/bi';
import { RiMastercardFill, RiBookLine } from 'react-icons/ri';
import { GiReceiveMoney, GiPayMoney, GiProfit } from 'react-icons/gi';
import { LuSunMoon } from "react-icons/lu";

// Import react-icons for the missing payment icons

import { SiGrab, SiLine } from 'react-icons/si'; // Grab, Line (approximations)

// Define styles
const styles = {
  sidebarIcon: {
    fontSize: '18px',
  },
  cardIcon: {
    fontSize: '20px',
    marginInlineEnd: '5px',
  },
};

// Sidebar Icon Component
export const SidebarIcon = ({ style, icon: IconComponent, ...rest }) => {
  return (
    <IconComponent
      style={{ ...styles.sidebarIcon, ...style }}
      {...rest}
    />
  );
};

// Card Icon Component
export const CardIcon = ({ style, icon: IconComponent, ...rest }) => {
  return (
    <IconComponent
      style={{ ...styles.cardIcon, ...style }}
      {...rest}
    />
  );
};

// Main Icon Component
export const MainIcon = ({ className, icon: IconComponent, ...rest }) => {
  return (
    <IconComponent
      className={`${className ?? ''}`}
      {...rest}
    />
  );
};

// Existing Icon Exports
export const UsersIcon = (props) => <SidebarIcon icon={FaUsers} {...props} />;
export const DollarIcon = (props) => <SidebarIcon icon={FaDollarSign} {...props} />;
export const WalletIcon = (props) => <SidebarIcon icon={FaWallet} {...props} />;
export const ShoppingCartIcon = (props) => <SidebarIcon icon={FaShoppingCart} {...props} />;
export const CreditCardIcon = (props) => <SidebarIcon icon={FaCreditCard} {...props} />;
export const CalculatorIcon = (props) => <SidebarIcon icon={FaCalculator} {...props} />;
export const JournalBookIcon = (props) => <SidebarIcon icon={RiBookLine} {...props} />;

export const IncomeIcon = (props) => <CardIcon icon={GiReceiveMoney} {...props} />;
export const PayableAccountIcon = (props) => <CardIcon icon={GiPayMoney} {...props} />;
export const ReceivableAccountIcon = (props) => <CardIcon icon={GiReceiveMoney} {...props} />;
export const MastercardIcon = (props) => <CardIcon icon={RiMastercardFill} {...props} />;

export const ExpandIcon = (props) => <MainIcon icon={MdExpandMore} {...props} />;
export const CollapseIcon = (props) => <MainIcon icon={MdExpandLess} {...props} />;
export const SunIcon = (props) => <MainIcon icon={MdSunny} {...props} />;
export const MoonIcon = (props) => <MainIcon icon={LuSunMoon} {...props} />;
export const BellIcon = (props) => <MainIcon icon={MdNotifications} {...props} />;
export const SwapIcon = (props) => <MainIcon icon={MdSwapHoriz} {...props} />;
export const UserFillIcon = (props) => <MainIcon icon={BsFillPersonFill} {...props} />;
export const LockFillIcon = (props) => <MainIcon icon={BsFillLockFill} {...props} />;
export const CalendarFillIcon = (props) => <MainIcon icon={BsFillCalendarFill} {...props} />;
export const GlobalFillIcon = (props) => <MainIcon icon={BsGlobe} {...props} />;
export const TickIcon = (props) => <MainIcon icon={AiFillCheckCircle} {...props} />;
export const CloseIcon = (props) => <MainIcon icon={AiFillCloseCircle} {...props} />;
export const EditIcon = (props) => <MainIcon icon={AiFillEdit} {...props} />;
export const DeleteIcon = (props) => <MainIcon icon={AiFillDelete} {...props} />;
export const SaveIcon = (props) => <MainIcon icon={AiFillSave} {...props} />;
export const CircularArrowIcon = (props) => <MainIcon icon={BiTransfer} {...props} />;
export const DotsIcon = (props) => <MainIcon icon={BiDotsHorizontalRounded} {...props} />;
export const DownIcon = (props) => <MainIcon icon={BiChevronDown} {...props} />;
export const PlusIcon = (props) => <MainIcon icon={BiPlus} {...props} />;
export const LogoutIcon = (props) => <MainIcon icon={BiLogOut} {...props} />;
export const PrintIcon = (props) => <MainIcon icon={BiPrinter} {...props} />;
export const UpIcon = (props) => <MainIcon icon={BiChevronDown} {...props} />;
export const ViewIcon = (props) => <MainIcon icon={MdOutlinePreview} {...props} />;
export const BarcodeIcon = (props) => <MainIcon icon={BiBarcode} {...props} />;
export const CashIcon = (props) => <MainIcon icon={BsCashCoin} {...props} />;
export const ProfileIcon = (props) => <MainIcon icon={BsFillPersonFill} {...props} />;
export const PasswordIcon = (props) => <MainIcon icon={BsFillLockFill} {...props} />;
export const ProfitIcon = (props) => <MainIcon icon={GiProfit} {...props} />;

// New Payment-Related Icons from react-icons
export const AirPayIcon = (props) => <CardIcon icon={FaMoneyBillWave} {...props} />; 
export const GrabPayIcon = (props) => <CardIcon icon={SiGrab} {...props} />; 
export const BankIcon = (props) => <CardIcon icon={FaUniversity} {...props} />; 
export const VisaIcon = (props) => <CardIcon icon={FaCcVisa} {...props} />; 
export const LineIcon = (props) => <CardIcon icon={SiLine} {...props} />;
export const MasterCardIcon = (props) => <CardIcon icon={FaCcMastercard} {...props} />; 
export const OnePayIcon = (props) => <CardIcon icon={FaMoneyBillWave} {...props} />; 
export const PayPalIcon = (props) => <CardIcon icon={FaPaypal} {...props} />; 
export const VnptMoneyIcon = (props) => <CardIcon icon={FaMoneyBillWave} {...props} />; 
export const IconVisa = (props) => <CardIcon icon={FaCcVisa} {...props} />;
export const LineIconIcon = (props) => <CardIcon icon={SiLine} {...props} />;
export const MasterCartIcon = (props) => <CardIcon icon={FaCcMastercard} {...props} />; 
export const PaypalIcon = (props) => <CardIcon icon={FaPaypal} {...props} />;