import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faSearch,
  faEllipsisV,
  faArrowLeft,
  faEdit,
  faPlus,
  faArrowRight,
  faChevronDown,
  faList,
  faCaretDown,
  faCaretLeft,
  faCheckSquare,
  faSquare,
  faStar,
  faCaretRight,
  faFilter,
  faTrash,
  faSync,
  faTimes,
  faTimesCircle,
  faCheck,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

export const Icon = ({  name, size = 24, color = 'black', ...props }) => {
  const getIcon = () => {
    switch (name) {

      case 'search': return faSearch;
      case 'more-vertical': return faEllipsisV;
      case 'arrow-left': return faArrowLeft;
      case 'edit-2': return faEdit;
      case 'plus': return faPlus;
      case 'check': return faCheckSquare;
      case'success':return faCheck;
      case 'square': return faSquare;
      case 'check-square': return faCheckSquare;
      case 'star': return faStar;
      case 'arrow-forward-ios': return faArrowRight;
      case 'keyboard-arrow-down': return faChevronDown;
      case 'format-list-bulleted': return faList;
      case 'fa-caret-down': return faCaretDown;
      case 'fa-caret-left': return faCaretLeft;
      case 'fa-caret-right': return faCaretRight;
      case 'add': return faPlus;
      case 'filter': return faFilter;
      case 'trash':
        return faTrash;
      case 'close':
        return faTimes;
      case 'close-circle':
        return faTimesCircle;
      case 'repeat':
        return faSync;
        case 'calendar':
        return faCalendarAlt;
      default: return faEllipsisV;
    }
  };

  return <FontAwesomeIcon icon={getIcon()} size={size} color={color} {...props} />;
};

