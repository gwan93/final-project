pragma solidity 0.5.0;

// Import 'flattened' ERC721 specs
import "./ERC721Full.sol";

// Create the 'Color' smart contract
contract Color is ERC721Full {
  // Create an array of string called colors to
  // keep track of colors made on this contract
  string[] public colors;

  // Creates an object/directionary with
  // key (string), value (boolean)
  mapping(string => bool) _colorExists;

  // Run constructor function. Arguments are the name and the symbol
  constructor() ERC721Full("Color", "COLOR") public {
  }

  // E.G. color = "#FFFFFF"
  // mint accepts a string argument '_color'
  function mint(string memory _color) public {
    // Require that the new color be unique
    // if color does not exist (require(true)), continue minting color
    // if color exists (require(false)), will not continue to mint
    require(!_colorExists[_color]);

    // Add the color to the colors array
    // The index of the array is returned
    uint _id = colors.push(_color);

    // _mint(address to, uint256 tokenId)
    // msg.sender is ethereum address of the
    // person who called _mint
    _mint(msg.sender, _id);

    // After minting, add that color as a key
    // to _colorExists (object/dict) with a 
    // value of true to prevent duplicate colors
    // from being created
    _colorExists[_color] = true;
  }

}
