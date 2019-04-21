using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using System.Net.Http;
using System.Timers;

// Links for making 3D object using JavaScript and displaying on MagicLeap
// https://www.npmjs.com/package/@magicleap/prismatic
// https://creator.magicleap.com/learn/guides/helio
// https://magicleaphelio.com/devsamples/ecm

//  Sample for making GET and POST
//  var values = new Dictionary<string, string>
//      {
//        { "thing1", "hello" }
//      };
//  string content = new FormUrlEncodedContent(values);
//  string response = await client.GetStringAsync(address + "/currEquation");
//  string request = await client.PostAsync(address + "/equation", content);

public class Networking : MonoBehaviour
{
    // Network Configuration
    private static readonly HttpClient client = new HttpClient();
    private static string ip = "10.19.146.155";
    private static string port = "3000";
    private static string address = "http://" + ip + ":" + port;

    // Timer
    private Timer aTimer;

    // Meshes
    private ArrayList meshes = new ArrayList();

    // Start is called before the first frame update
    void Start()
    {
        SetTimer();
    }

    // Update is called once per frame
    void Update()
    {
    }

    // Timer is set at a one second interval to request for equations
    private void SetTimer()
    {
        aTimer = new Timer(1000);
        aTimer.Elapsed += new ElapsedEventHandler(OnTimedEvent);
        aTimer.AutoReset = true;
        aTimer.Enabled = true;
    }

    private async void OnTimedEvent(object source, ElapsedEventArgs e)
    {
        string equationsString = await client.GetStringAsync(address + "/displayEquation");
        equationsString.Remove(0);
        equationsString.Remove(equationsString.Length - 1);
        string[] equations = equationsString.Split(',');
        // TODO: Compare equations with stored equations to decide if we need to re-render
    }

    // TODO: Sending back to server
    // Two options for sending to the server the changes:
    // 1. Send the meshes back
    // 2. Send the adjustments back
    private async void sendMeshes()
    {
    }

    private async void sendAdustments()
    {
    }

    private void OnApplicationQuit()
    {
        aTimer.Stop();
    }
}
