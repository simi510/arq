var arq={sendPacket:null,pause:null,faster:null,slower:null,dropPackets:null,init:function()
{
	
	document["getElementById"]("canvas")["style"]["backgroundColor"]= "#000000";var element=document["getElementById"]("canvas");var canvas=element["getContext"]("2d");var canvasHeight=element["height"];var canvasWidth=element["width"];var textElem=document["getElementById"]("text-canvas");var textCanvas=textElem["getContext"]("2d");var textCanvasWidth=textElem["width"];var textCanvasHeight=textElem["height"];var host=15;var hostWidth=50;var hostHeight=31;var padding=5;var packetXPos=12;var sender= new Array(host);var receiver= new Array(host);var packets= new Array(host);var droppedPackets= new Array(host);var packetsIndex=0;var packetWindow= new PacketWindow(5,8,60,180);createSendersAndReceivers();var interval=setInterval(draw,15);var packetsSent=0;var messageToScreen="We are ready. Press the Send Packet Button";var globalDy=0;var packetsDropped=false;var countDownInterval=null;var count=10;var resendMessage="The packet will be Resent in "+ count+ " seconds";resendMessageVisible= false;packs = 0;confirm = 0;received = 0;
	function draw() {
	    canvas["clearRect"](0, 0, canvasWidth, canvasHeight);
	    textCanvas["clearRect"](0, 0, textCanvasWidth, textCanvasHeight);
	    packetWindow["drawWindow"]();
	    drawSendersAndReceivers();
	    drawPackets();
	    writeSenderAndReceiverLabels();
	    message(messageToScreen, 100, 15);
	    if (resendMessageVisible) {
	        message(resendMessage, 150, 15)
	    }
	}

	function selectPacket(x, y) {
	    for (var i = 0; i < packets["length"]; i++) {
	        if (packets[i]) {
	            var xMin = packets[i]["xPos"];
	            var xMax = xMin + packets[i]["packetWidth"];
	            var yMin = packets[i]["packetYPos"];
	            var yMax = yMin + packets[i]["packetHeight"];
	            if ((x < xMax && x > xMin) && (y < yMax && y > yMin)) {
	                packets[i]["drop"] = true;
	                packets[i]["color"] = "#1ec503";
	                packets[i]["clearPacket"]();
	                packets[i]["drawPacket"]()
	            }
	        }
	    }
	}

	function writeOnCanvas(text, x, y, color, fontSize) {
	    canvas["fillStyle"] = color;
	    canvas["font"] = "bold " + fontSize + "px Arial";
	    canvas["fillText"](text, y, x)
	}

	function message(message, x, y) {
	    textCanvas["fillStyle"] = "#1ec503";
	    textCanvas["font"] = "bold 18px Arial";
	    textCanvas["fillText"](message, y, x)
	}

	function writeSenderAndReceiverLabels() {
	    writeOnCanvas("Receiver", 570, 515, "#1ec503", 16);
	    writeOnCanvas("Sender", 570, 10, "#1ec503", 16)
	}
	this["pause"] = function() {
	    messageToScreen = "Click on Packet To kill, then press kill button";
	    var label = document["getElementById"]("pause-button")["value"];
	    if (label === "Stop") {
	        document["getElementById"]("range")["innerHTML"] = "Paused";
	        document["getElementById"]("pause-button")["value"] = "start";
	        document["getElementById"]("kill-button")["disabled"] = false;
	        document["getElementById"]("send-button")["disabled"] = true;
	        document["getElementById"]("fast-button")["disabled"] = true;
	        document["getElementById"]("slow-button")["disabled"] = true;
	        document["getElementById"]("reset-button")["disabled"] = true;
	        globalDy = Packet["prototype"]["dy"];
	        Packet["prototype"]["dy"] = 0
	    } else {
	        document["getElementById"]("range")["innerHTML"] = "Speed " + Packet["prototype"]["dy"];
	        document["getElementById"]("pause-button")["value"] = "Stop";
	        document["getElementById"]("kill-button")["disabled"] = true;
	        document["getElementById"]("send-button")["disabled"] = false;
	        document["getElementById"]("fast-button")["disabled"] = false;
	        document["getElementById"]("slow-button")["disabled"] = false;
	        document["getElementById"]("reset-button")["disabled"] = false;
	        Packet["prototype"]["dy"] = globalDy;
	        globalDy = 0
	    }
	};

	this["faster"] = function() {
	    var dy = Packet["prototype"]["dy"];
	    if (dy > 0) {
	        dy += 1;
	        Packet["prototype"]["dy"] = dy;
	        document["getElementById"]("range")["innerHTML"] = "Speed " + dy
	    }
	};
	this["slower"] = function() {
	    if (Packet["prototype"]["dy"] > 1) {
	        Packet["prototype"]["dy"] -= 1;
	        document["getElementById"]("range")["innerHTML"] = "Speed " + Packet["prototype"]["dy"]
	    }
	};
	this["dropPackets"] = function() {
	    messageToScreen = "Press the Start button to continue";
	    for (var i = 0; i < packets["length"]; i++) {
	        var shouldResend = false;
	        if (packets[i]) {
	            if (packets[i]["drop"] == true) {
	                if (receiver[i]["receivedPacket"] == false) {
	                    shouldResend = true;
	                    packets[i] = null;
	                    packetsDropped = true;
	                    droppedPackets[i] = true
	                } else {
	                    if (receiver[i]["receivedPacket"] == true) {
	                        packets[i] = null;
	                        if (packetsSent === 1 || packetsSent === 5) {
	                            shouldResend = true;
	                            packetsDropped = true;
	                            droppedPackets[i] = true
	                        }
	                    }
	                }
	            }
	        }
	        if (shouldResend) {
	            countDownInterval = setInterval(countDownTime, 1000);
	            resendMessageVisible = true;
	            setTimeout(function() {
	                resendPackets()
	            }, 10000)
	        }
	    }
	};

	function countDownTime() {
	    count -= 1;
	    resendMessage = "The packet will be Resent in " + count + " seconds"
	}

	function PacketWindow(x, y, h, w) {
	    this["x"] = x;
	    this["y"] = y;
	    this["h"] = h;
	    this["w"] = w;
	    this["xIncrement"] = 50;
	    this["drawWindow"] = function() {
	        for (var i = 1; i < host; i++) {
	            if (sender[i - 1]["receivedPacket"] && !sender[i - 1]["isDrawn"]) {
	                this["incrementXPos"]();
	                sender[i - 1]["isDrawn"] = true
	            }
	        }
	        drawRect(this["y"], this["x"], this["h"], this["w"], "#1ec503")
	    };
	    this["incrementXPos"] = function() {
	        if (this["y"] < 345) 
	        {
	            this["y"] += (hostHeight + padding)
	        }
	    }
	}

	function Packet(index) {
	    this["upperYCoOrd"] = 525;this["lowerYCoOrd"] = 8;this["packetWidth"] = 50;this["packetHeight"] = 30;this["packetXPos"] = 12;this["cellWidth"] = 40;this["index"] = index;this["xIncrement"] = 31 + padding;this["packetYPos"] = this["lowerYCoOrd"] + (index * this["xIncrement"]);this["isSyn"] = true;this["color"] = "#FF69B4";this["drop"] = false;this["xPos"] = this["lowerYCoOrd"];this["isVisible"] = true;
	}
	Packet["prototype"]["dy"] = 1;
	Packet["prototype"]["setDyToOne"] = function() {
	    this["dy"] = 1
	};
	Packet["prototype"]["drawPacket"] = function() {
	    if (this["isVisible"]) {
	        drawRect(this["packetYPos"], this["xPos"], this["packetWidth"], this["packetHeight"], this["color"]);
	        var textXPos = 20;
	        var textYPos = 25;
	        if (this["index"] > 9) {
	            textXPos = 9
	        }
	        writeOnCanvas(this["index"], this["packetYPos"] + textYPos, this["xPos"] + textXPos, "#000000", 15);
	        this["sendPacket"]()
	    }
	};
	Packet["prototype"]["clearPacket"] = function(index) {
	    var x = this["xPos"] - 2;
	    canvas["clearRect"](this["packetYPos"], x, this["packetWidth"] + 5, this["packetHeight"] + 5)
	};
	Packet["prototype"]["sendPacket"] = function() {
	    if ((this["xPos"] < this["upperYCoOrd"]) && this["isSyn"]) {
	        this["xPos"] += this["dy"]
	    } else {
	        if (this["isSyn"]) {
	            if (this["index"] == 0 || noDrop(this["index"])) {
	                receiver[this["index"]]["color"] = "red";
	                receiver[this["index"]]["receivedPacket"] = true;
	                this["isSyn"] = false;
	                document["getElementById"]("received")["innerHTML"] = "Received Packets " + ++received;
	                messageToScreen = "The Packet " + this["index"] + " was received, and confirmation was sent."
	            } else {
	                packets[this["index"]] = null;
	                droppedPackets[this["index"]] = true
	            }
	        } else { 
	            this["sendAck"]();
	            receiver[this["index"]]["sentPacket"] = true
	        }
	    }
	};
	Packet["prototype"]["sendAck"] = function() {
	    if ((this["xPos"] > this["lowerYCoOrd"]) && !this["isSyn"]) {
	        if (this["xPos"] + this["dy"] < this["lowerYCoOrd"]) {
	            this["dy"] = this["lowerYCoOrd"] + this["xPos"]
	        }
	        this["xPos"] -= this["dy"]
	    } else {
	        if (packets[this["index"]]) {
	            packetsSent--;
	            if (this["index"] > 0 && !packets[this["index"] - 1]) {
	                packetsSent--;
	                var invisiblePacket = new Packet(this["index"] - 1);
	                invisiblePacket["isVisible"] = false;
	                packets[this["index"] - 1] = invisiblePacket;
	                sender[this["index"] - 1]["receivedPacket"] = true
	            }
	            packets[this["index"]]["isVisible"] = false;
	            sender[this["index"]]["receivedPacket"] = true;
	            document["getElementById"]("confirm")["innerHTML"] = "Confirmed Packets " + ++confirm;
	            messageToScreen = "Confirmed the Packet " + this["index"] + " was received."
	        }
	    }
	};

	function noDrop(index) {
	    var notDropped = true;
	    for (var i = index; i >= 0; i--) {
	        if (!packets[i]) {
	            notDropped = false
	        }
	    }
	    return notDropped
	}
	this["sendPacket"] = function() {
	    if (((packetsSent < 5) && (packetsIndex < host)) && !packetsDropped) {
	        document["getElementById"]("packs")["innerHTML"] = "Packets Sent " + ++packs;
	        createPacket(packetsIndex);
	        packetsIndex++;
	        packetsSent++
	    }
	};

	function resendPackets() {
	    clearInterval(countDownInterval);
	    resendMessageVisible = false;
	    count = 16;
	    var totalPacketsDropped = 1;
	    var lastPacketDropped = 0;
	    for (var i = 0; i < droppedPackets["length"]; i++) {
	        if (droppedPackets[i] == true) {
	            totalPacketsDropped--;
	            lastPacketDropped = i;
	            document["getElementById"]("packs")["innerHTML"] = "Packets Sent " + ++packs;
	            createPacket(i);
	            packets[i]["drawPacket"]();
	            droppedPackets[i] = null
	        }
	    }
	    var firstPacketDropped = lastPacketDropped + totalPacketsDropped;
	    if (firstPacketDropped != lastPacketDropped) {
	        messageToScreen = "Okay, we are Resending Packets " + firstPacketDropped + " - " + lastPacketDropped
	    } else {
	        messageToScreen = "Okay, we are Resending Packet " + firstPacketDropped
	    }
	    packetsDropped = false
	}

	function createPacket(index) {
	    var packet = new Packet(index);
	    packets[index] = packet;
	    sender[index]["sentPacket"] = true;
	    sender[index]["color"] = "#00FFFF";
	    messageToScreen = "Packet " + index + " was sent."
	}

	function drawPackets() {
	    for (var i = 0; i < host; i++) {
	        if (packets[i]) {
	            packets[i]["drawPacket"]()
	        }
	    }
	}

	function drawSendersAndReceivers() {
	    for (var i = 0; i < host; i++) {
	        sender[i]["drawHost"]();
	        receiver[i]["drawHost"]()
	    }
	}

	function Host(x, y, index, type, color) {
	    this["width"] = hostWidth;
	    this["height"] = hostHeight;
	    this["XPos"] = x;
	    this["YPos"] = y;
	    this["index"] = index;
	    this["type"] = type;
	    this["color"] = color;
	    this["sentPacket"] = false;
	    this["receivedPacket"] = false;
	    this["isDrawn"] = false
	}
	Host["prototype"]["drawHost"] = function() {
	    drawRect(this.YPos, this.XPos, this["width"], this["height"], this["color"]);
	    if (this["receivedPacket"] == true) {
	        var drawXPos = this["XPos"] + 20;
	        var drawYPos = this["YPos"] + 25;
	        if (this["index"] > 9) {
	            drawXPos -= 6
	        }
	        this["drawOnReceiver"](this["index"], drawXPos, drawYPos)
	    }
	};
	Host["prototype"]["drawOnReceiver"] = function(value, x, y) {
	    writeOnCanvas(value, y, x, "#000000", 16)
	};

	function createSendersAndReceivers() {
	    var senderY = (canvasHeight - hostHeight) - 50;
	    var receiverY = 10;
	    var x = 10;
	    var xIncrement = hostHeight + padding;
	    for (var i = 0; i < host; i++) {
	        var aSender = new Host(senderY, x, i, "sender", null);
	        var aReceiver = new Host(receiverY, x, i, "receiver", null);
	        sender[i] = aSender;
	        receiver[i] = aReceiver;
	        x += xIncrement
	    }
	}
	$("canvas")["click"](function(e) {
	    var clickedXPos = e["pageX"];
	    var clickedYPos = e["pageY"];
	    selectPacket(clickedXPos, clickedYPos)
	});

	function drawRect(x, y, w, h, color) {
	    if (color) {
	        canvas["fillStyle"] = color
	    } else {
	        canvas["fillStyle"] = "#FFFFFF"
	    }
	    canvas["beginPath"]();
	    canvas["strokeStyle"] = "#1ec503";
	    canvas["rect"](y, x, w, h);
	    canvas["closePath"]();
	    canvas["stroke"]();
	    canvas["fill"]()
	}
	}
}

