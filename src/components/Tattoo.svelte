<template>
  <canvas id="myCanvas" width="250" height="250"></canvas>
  <input type="text" id="head_address" bind:value={head_address}>
  <input type="text" id="head_hex" value={head_hex}>
  // set size of the canvas
  <input type="value" id="size" bind:value={size}>
  <input type="value" id="canary_size" bind:value={canary_size}>
  <input type="value" id="limit" bind:value={limit}>
  <input type="value" id="cycles" bind:value={cycles}>
  <input type="value" id="dot" bind:value={dot}>
  <input type="value" id="color_1" bind:value={color_1}>
  <input type="value" id="color_0" bind:value={color_0}>
</template>

<script>
	// import { u8aToHex } from "@polkadot/util"
	// import { decodeAddress } from "@polkadot/util-crypto"

  // variables
  let head_address = "HkRdC1w5XDvQQadAS2nL58mPRBCLyUCZAAiaV7DUWJgj7P8";
	let head_hex = "e4e22de5d60cf09f608238ec3eff9f501e7b43b0f215b0a035c330c0af043e0c";
  let size = 250;
	let canary_size = 220;
  let limit = 0.768;
  let cycles = 10;
  let dot = 6;
  let color_1 = "black";
  let color_0 = "red";

  // hex the base58 public key
	// let head_hex = u8aToHex(decodeAddress(head_address))
  
	// hex to binary format
  let head_bits = hexToBits(head_hex);

  // $ : head_hex = u8aToHex(decodeAddress(head_address));
  $ : head_bits = hexToBits(head_hex);

  // function to get binaries
	function hexToBits(head_hex) {
    	let bits = [];
    	for (var i = 0; i < 32; i++) {
      		let byte = parseInt(head_hex.substr(i * 2, 2), 16);
      		for (var j = 0; j < 8; ++j) {
        		bits.push((byte & (1 << (7 - j))) != 0);
        		}
        	}
    	return bits;
    }

  // variables for canvas
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  // function to draw the bird
  function canaryBird(ctx, x, y, size, color = (ctx, path) => ctx.fill(path)) {
      // Kusama bird logo in svg format
      let path = new Path2D(
         "M373.1,126.9c-5.2-4.1-11.4-9.7-22.7-11.1c-10.6-1.4-21.4,5.7-28.7,10.4c-7.3,4.7-21.1,18.5-26.8,22.7\
          c-5.7,4.2-20.3,8.1-43.8,22.2s-115.7,73.3-115.7,73.3l24,0.3L52.4,299.8h10.7l-15.4,11.7c0,0,13.6,3.6,25-3.6l0,3.3\
          c0,0,127.4-50.2,152-37.2l-15,4.4c1.3,0,25.5,1.6,25.5,1.6s0.8,15.1,15.4,24.8c14.6,9.6,14.9,14.9,14.9,14.9s-7.6,3.1-7.6,7\
          c0,0,11.2-3.4,21.6-3.1c10.4,0.3,19.5,3.1,19.5,3.1s-0.8-4.2-10.9-7c-10.2-2.9-20.1-13.8-25-19.8c-4.9-6-8.3-16.7-4.1-27.4	c3.5-9.1,15.7-14.1,40.9-27.1c29.7-15.4,36.5-26.8,40.7-35.7c4.2-8.9,10.4-26.6,13.9-34.9c4.4-10.7,9.8-16.4,14.3-19.8 \
          c4.4-3.4,24.5-10.9,24.5-10.9S378,130.8,373.1,126.9z"
      );
      ctx.save();
      // learn more https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate
      // lets set the bird in the middle of the canvas
      ctx.translate(x / 2, y / 2);
      // set the size of the bird
      ctx.scale(size / canary_size*2, size / canary_size*2);
      ctx.translate(-canary_size, -canary_size);
      f(ctx, path);
      ctx.restore();
    }

  // function to draw tattoo with kusama logo and public key in binary format
  function spiralTattoo(ctx, bits) {

    ctx.save();
    ctx.translate(0.5 - dot, 0.5 + dot);
    // set color of the filling
    ctx.fillStyle = color_1;

    var radius = 0.5 - dot;
    for (var i = 0; i < bits.length; i++) {
      radius -= ((0.5 / bits.length) * limit) / (radius * 4);
      ctx.rotate((((Math.PI * 2) / bits.length) * cycles) / (radius * 4));
      ctx.save();
      ctx.translate(0, -radius);
      ctx.beginPath();
      // here we check if the bit is 1 or 0 and draw the black dot or not
      ctx.arc(0, 0, bits[i] ? dot : dot / 1.5, 0, Math.PI * 2);
      ctx.fillStyle = bits[i] ? color_1 : color_0;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    ctx.lineWidth = 10;
    // time to draw the bird in the middle of the canvas
    canaryBird(ctx, 1 - dot, 1 + dot, size, (ctx, path) => {
      ctx.strokeStyle = "black";
      ctx.stroke(path);
    });
  }
  // lets draw spiral tattoo
  ctx.save();
  ctx.translate(0, 0);
  ctx.scale(250, 250);
  spiralTattoo(ctx, head_bits);
  ctx.restore();
</script>
