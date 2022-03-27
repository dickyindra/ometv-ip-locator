const script = document.createElement("script")

script.innerHTML = `
window._RTCPeerConnection  = window.oRTCPeerConnection || window.RTCPeerConnection
window.RTCPeerConnection = function (...args) {
    const pc = new window._RTCPeerConnection(...args)
    pc._addIceCandidate = pc.addIceCandidate

    pc.addIceCandidate = function (iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(" ")

        if (fields[7] === "srflx") {
            fetch("https://ipapi.co/" + fields[4] + "/json/")
                .then((response) => response.json())
                .then((data) => {
                    let html = \`
                        OmeTV IP Location <br/>
                        ----- <br/>
                        IP: {{ip}} <br/>
                        City: {{city}} <br/>
                        Region: {{region}} <br/>
                        Country: {{country_name}} <br/>
                        ISP: {{org}} <br/>
                        ----- <br/>
                        Created By: Dicky Indra Asmara <br/>
                        My Instagram: <a href="https://www.instagram.com/dickyindraasmara/" target="_blank">@dickyindraasmara</a> <br/>
                        Github: <a href="https://github.com/dickyindra/ometv-ip-locator" target="_blank">OmeTV IP Locator Repository</a>
                    \`

                    html = html.replace("{{ip}}", fields[4])
                    html = html.replace("{{city}}", data.city)
                    html = html.replace("{{region}}", data.region)
                    html = html.replace("{{country_name}}", data.country_name)
                    html = html.replace("{{org}}", data.org)

                    document.getElementById("ometv-ip-chat-info")?.remove()

                    document.getElementById("chat-history").innerHTML += \`
                        <div class="message system" id="ometv-ip-chat-info">
                            <div class="message-avatar">
                                <img class="logo" src="/images/roulette/avatar.svg">
                            </div>
                            <div class="message-bubble">
                                <span class="tr" data-tr="rules" data-tr-id="1244">
                                    {{html}}
                                </span>
                            </div>
                        </div>
                    \`.replace("{{html}}", html)
                })
        }

        return pc._addIceCandidate(iceCandidate, ...rest)
    }

    return pc
}
`

document.documentElement.appendChild(script)
